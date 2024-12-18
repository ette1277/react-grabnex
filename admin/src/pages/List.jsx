const placeholderImage = 'https://via.placeholder.com/150'; // Define placeholder image

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setList(prevList => prevList.filter(item => item._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete product.');
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      {loading && <p>Loading products...</p>}
      {!loading && list.length === 0 && <p>No products found.</p>}
      <div className='flex flex-col gap-2'>
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>
        {!loading && list.map(item => (
          <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={item._id}>
            <img className='w-12' src={item.image && item.image[0] ? item.image[0] : placeholderImage} alt={item.name ? `Image of ${item.name}` : 'Default Product Image'} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p
              onClick={() => removeProduct(item._id)}
              className='text-right md:text-center cursor-pointer text-lg text-red-600 delete-btn'
              aria-label={`Delete ${item.name}`}
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};


export default List;