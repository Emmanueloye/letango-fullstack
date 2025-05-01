import loaderImage from '../../assets/letango-spinnernew.gif';

const Loader = () => {
  return (
    <div className='fixed top-0 left-0 bg-green-100/60 backdrop-blur-[1px] w-full h-screen z-50'>
      <div className='flex justify-center items-center min-h-screen mt-10'>
        <img src={loaderImage} alt='Loader image' width={300} />
      </div>
    </div>
  );
};

export default Loader;
