import { TextInput, Select, FileInput, Alert, Spinner, Button, Badge } from 'flowbite-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, clearError } from '../redux/user/userSlice.js';
import { supabase } from '../supabase/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

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

  // Available sports & amenities (could also come from API)
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
    <div className="flex-1 w-full md:max-w-5xl self-center px-6">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a Facility</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Name & Location */}
        <TextInput
          placeholder="Facility Name"
          required
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextInput
          placeholder="Location"
          required
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />

        {/* Sports Selection */}
        <div>
          <label className="block mb-2 font-medium">Sports Supported</label>
          <div className="flex flex-wrap gap-2">
            {sportOptions.map(sport => (
              <Badge
                key={sport}
                color={formData.sports.includes(sport) ? 'success' : 'gray'}
                onClick={() => handleMultiSelect('sports', sport)}
                className="cursor-pointer"
              >
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block mb-2 font-medium">Amenities Offered</label>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map(amenity => (
              <Badge
                key={amenity}
                color={formData.amenities.includes(amenity) ? 'info' : 'gray'}
                onClick={() => handleMultiSelect('amenities', amenity)}
                className="cursor-pointer"
              >
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <label className="block mb-2 font-medium">Description</label>
        <ReactQuill
          theme="snow"
          className="h-48 mb-12"
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        {/* Image Upload */}
        <div className="border-4 border-teal-500 border-dotted p-3 mb-5">
          <FileInput type="file" accept="image/*" multiple onChange={handleImageChange} />
          <Button type="button" color="purple" onClick={handleUploadImages} className="mt-3">
            {uploadingImage ? (
              <>
                <Spinner size="sm" /> <span className="pl-2">Uploading...</span>
              </>
            ) : (
              'Upload Images'
            )}
          </Button>
        </div>

        {/* Preview Uploaded Images */}
        {formData.images.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {formData.images.map((url, idx) => (
              <img key={idx} src={url} alt="Uploaded" className="h-32 w-32 object-cover rounded" />
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && <Alert color="failure">{error}</Alert>}

        {/* Submit */}
        <Button type="submit" gradientDuoTone="purpleToPink" className="mt-4">
          Create Facility
        </Button>
      </form>
    </div>
  );
}
