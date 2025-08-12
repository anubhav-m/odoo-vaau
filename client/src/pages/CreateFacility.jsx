import { TextInput, FileInput, Alert, Spinner, Button, Badge } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, clearError } from '../redux/user/userSlice.js';
import { supabase } from '../supabase/supabaseClient.js';
import { useNavigate } from 'react-router-dom';
import { HiLocationMarker, HiPhotograph, HiOutlineClipboardList, HiOutlineTicket, HiOutlineViewGridAdd, HiOutlineDocumentText } from 'react-icons/hi';

export default function CreateFacility() {
  const { error } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    sports: [],
    amenities: [],
    images: []
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const sportOptions = ['Football', 'Basketball', 'Tennis', 'Badminton', 'Swimming', 'Cricket'];
  const amenityOptions = ['Parking', 'Changing Rooms', 'Showers', 'Lights', 'Seating', 'Cafeteria'];

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const alreadySelected = prev[field].includes(value);
      return {
        ...prev,
        [field]: alreadySelected
          ? prev[field].filter(item => item !== value)
          : [...prev[field], value]
      };
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleUploadImages = async () => {
    dispatch(clearError());
    setUploadingImage(true);

    try {
      if (!imageFiles.length) throw new Error('Please select at least one image');

      const uploadedUrls = [];
      for (let file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('facility-image')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
          .storage
          .from('facility-image')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    } catch (err) {
      dispatch(setError(err.message || 'Something went wrong during image upload'));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      if (!formData.name.trim() || !formData.location.trim() || !formData.sports.length) {
        throw new Error('Please fill all required fields');
      }

      const res = await fetch('/api/facility/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      navigate(`/facility/${data.facility._id}`);
    } catch (err) {
      dispatch(setError(err.message || 'Something went wrong while creating facility'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 px-4 py-10">
      <div className="w-full md:max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
        <h1 className="text-center text-4xl font-bold mb-8 text-purple-600 dark:text-purple-400">
          Create a Facility
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="relative">
            <HiOutlineViewGridAdd className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 text-xl" />
            <TextInput
              placeholder="Facility Name"
              required
              shadow
              className="pl-10"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Location */}
          <div className="relative">
            <HiLocationMarker className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500 dark:text-purple-400 text-xl" />
            <TextInput
              placeholder="Location"
              required
              shadow
              className="pl-10"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Sports */}
          <div>
            <label className="flex items-center mb-3 font-semibold text-gray-700 dark:text-gray-200">
              <HiOutlineClipboardList className="mr-2 text-purple-500 dark:text-purple-400 text-xl" />
              Sports Supported
            </label>
            <div className="flex flex-wrap gap-3">
              {sportOptions.map(sport => (
                <Badge
                  key={sport}
                  color={formData.sports.includes(sport) ? 'purple' : 'gray'}
                  onClick={() => handleMultiSelect('sports', sport)}
                  className={`cursor-pointer px-4 py-2 rounded-full shadow hover:scale-105 transition ${
                    formData.sports.includes(sport)
                      ? 'bg-purple-500 text-white dark:bg-purple-400'
                      : ''
                  }`}
                >
                  {sport}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="flex items-center mb-3 font-semibold text-gray-700 dark:text-gray-200">
              <HiOutlineTicket className="mr-2 text-indigo-500 dark:text-indigo-400 text-xl" />
              Amenities Offered
            </label>
            <div className="flex flex-wrap gap-3">
              {amenityOptions.map(amenity => (
                <Badge
                  key={amenity}
                  color={formData.amenities.includes(amenity) ? 'indigo' : 'gray'}
                  onClick={() => handleMultiSelect('amenities', amenity)}
                  className={`cursor-pointer px-4 py-2 rounded-full shadow hover:scale-105 transition ${
                    formData.amenities.includes(amenity)
                      ? 'bg-purple-500 text-white dark:bg-purple-400'
                      : ''
                  }`}
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <label className="flex items-center mb-2 font-semibold text-gray-700 dark:text-gray-200">
            <HiOutlineDocumentText className="mr-2 text-purple-500 dark:text-purple-400 text-xl" />
            Description
          </label>
          <ReactQuill
            theme="snow"
            className="h-48 mb-12 dark:bg-gray-900 dark:text-white"
            onChange={(value) => setFormData({ ...formData, description: value })}
          />

          {/* Image Upload */}
          <div className="border-4 border-purple-400 border-dotted p-5 rounded-lg">
            <label className="flex items-center mb-2 font-semibold text-purple-600 dark:text-purple-400">
              <HiPhotograph className="mr-2 text-purple-600 dark:text-purple-400 text-xl" />
              Upload Images
            </label>
            <FileInput type="file" accept="image/*" multiple onChange={handleImageChange} />
            <Button
              type="button"
              color="purple"
              onClick={handleUploadImages}
              className="mt-4 w-full bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-400 dark:hover:bg-purple-500"
            >
              {uploadingImage ? (
                <>
                  <Spinner size="sm" /> <span className="pl-2">Uploading...</span>
                </>
              ) : (
                'Upload Images'
              )}
            </Button>
          </div>

          {/* Preview */}
          {formData.images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {formData.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Uploaded"
                  className="h-32 w-32 object-cover rounded-lg shadow-md hover:scale-105 transition"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && <Alert color="failure">{error}</Alert>}

          {/* Submit */}
          <Button
            type="submit"
            className="mt-6 w-full shadow-lg hover:scale-[1.02] transition bg-gradient-to-r from-purple-500 to-indigo-500 text-white dark:from-purple-400 dark:to-indigo-400"
          >
            Create Facility
          </Button>
        </form>
      </div>
    </div>
  );
}
