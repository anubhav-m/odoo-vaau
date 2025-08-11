import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    HiAnnotation,
    HiArrowNarrowUp,
    HiDocumentText,
    HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HashLoader } from 'react-spinners'

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);


    useEffect(() => {
        setLoading(true);
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/getusers?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            }
            catch (error) {
                console.log(error.message);
            }

        };
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.log(error.message);
            }
        };
  
        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getcomments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.log(error.message);
            }
        };

        if (!currentUser.isAdmin) {
            setLoading(false);
            return;
        }

        if (currentUser.isAdmin) {
            Promise.all([fetchUsers(), fetchPosts(), fetchComments()])
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

    return (
        <div className='max-w-full h-full p-3 md:mx-auto'>
            {
                loading ? (
                    <div className="w-full flex justify-center items-center h-full">
                        <HashLoader className="text-center" color="aqua" size='50' loading={loading} />
                    </div>
                ) : (
                    currentUser.isAdmin ? (
                        <>
                            <div className='flex-wrap flex gap-4 justify-center'>
                                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                                    <div className='flex justify-between'>
                                        <div className=''>
                                            <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
                                            <p className='text-2xl'>{totalUsers}</p>
                                        </div>
                                        <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                                    </div>
                                    <div className='flex  gap-2 text-sm'>
                                        <span className='text-green-500 flex items-center'>
                                            <HiArrowNarrowUp />
                                            {lastMonthUsers}
                                        </span>
                                        <div className='text-gray-500'>Last month</div>
                                    </div>
                                </div>
                                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                                    <div className='flex justify-between'>
                                        <div className=''>
                                            <h3 className='text-gray-500 text-md uppercase'>
                                                Total Comments
                                            </h3>
                                            <p className='text-2xl'>{totalComments}</p>
                                        </div>
                                        <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                                    </div>
                                    <div className='flex  gap-2 text-sm'>
                                        <span className='text-green-500 flex items-center'>
                                            <HiArrowNarrowUp />
                                            {lastMonthComments}
                                        </span>
                                        <div className='text-gray-500'>Last month</div>
                                    </div>
                                </div>
                                <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
                                    <div className='flex justify-between'>
                                        <div className=''>
                                            <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
                                            <p className='text-2xl'>{totalPosts}</p>
                                        </div>
                                        <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
                                    </div>
                                    <div className='flex  gap-2 text-sm'>
                                        <span className='text-green-500 flex items-center'>
                                            <HiArrowNarrowUp />
                                            {lastMonthPosts}
                                        </span>
                                        <div className='text-gray-500'>Last month</div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
                                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                                        <h1 className='text-center p-2'>Recent users</h1>
                                        <Link to={'/dashboard?tab=users'}>
                                            <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                                    See all
                                                </span>
                                            </button>
                                        </Link>

                                    </div>
                                    <Table hoverable>
                                        <TableHead>
                                            <TableHeadCell>User image</TableHeadCell>
                                            <TableHeadCell>Username</TableHeadCell>
                                        </TableHead>
                                        {users &&
                                            users.map((user) => (
                                                <TableBody key={user._id} className='divide-y'>
                                                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                        <TableCell>
                                                            <img
                                                                src={user.profilePic}
                                                                referrerPolicy='no-referrer'
                                                                alt='user'
                                                                className='w-10 h-10 rounded-full bg-gray-500'
                                                            />
                                                        </TableCell>
                                                        <TableCell>{user.username}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                    </Table>
                                </div>
                                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                                        <h1 className='text-center p-2'>Recent comments</h1>
                                        <Link to={'/dashboard?tab=comments'}>
                                        <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                                See all
                                            </span>
                                        </button>
                                        </Link>
                                    </div>
                                    <Table hoverable>
                                        <TableHead>
                                            <TableHeadCell>Comment content</TableHeadCell>
                                            <TableHeadCell>Likes</TableHeadCell>
                                        </TableHead>
                                        {comments &&
                                            comments.map((comment) => (
                                                <TableBody key={comment._id.toString()} className='divide-y'>
                                                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                        <TableCell className='w-96'>
                                                            <p className='line-clamp-2'>{comment.content}</p>
                                                        </TableCell>
                                                        <TableCell>{comment.numberOfLikes}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                    </Table>
                                </div>
                                <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
                                    <div className='flex justify-between  p-3 text-sm font-semibold'>
                                        <h1 className='text-center p-2'>Recent posts</h1>
                                        <Link to={'/dashboard?tab=posts'}>
                                            <button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800">
                                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                                    See all
                                                </span>
                                            </button>
                                        </Link>
                                    </div>
                                    <Table hoverable>
                                        <TableHead>
                                            <TableHeadCell>Post image</TableHeadCell>
                                            <TableHeadCell>Post Title</TableHeadCell>
                                            <TableHeadCell>Category</TableHeadCell>
                                        </TableHead>
                                        {posts &&
                                            posts.map((post) => (
                                                <TableBody key={post._id} className='divide-y'>
                                                    <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                        <TableCell>
                                                            <img
                                                                src={post.image}
                                                                alt='user'
                                                                className='w-14 h-10 rounded-md bg-gray-500'
                                                            />
                                                        </TableCell>
                                                        <TableCell className='w-96'>{post.title}</TableCell>
                                                        <TableCell className='w-5'>{post.category}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            ))}
                                    </Table>
                                </div>
                            </div>
                        </>
                    ) :
                        (
                            <p className="text-center text-xl">403 - Unauthorized - Only admins can access this page</p>
                        )
                )
            }
        </div>
    );
}
