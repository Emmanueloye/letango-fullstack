import LinkBtn from './LinkBtn';

const ErrorDeck = () => {
  return (
    <section>
      <article className='bg-gray-50 dark:bg-slate-700  dark:text-slate-50 p-3 shadow h-screen mt-4 flex flex-col justify-center items-center'>
        <h1 className='text-5xl mb-3'>👀</h1>
        <h2 className='font-poppins text-2xl lg:text-base font-600'>404</h2>
        <p className='text-lg mb-4 text-center'>
          Oop! Sorry, we do not have the page you are looking for on our server.
        </p>
        <div className='mb-4'>
          <LinkBtn btnText='back to home' url='/' />
        </div>
        <div className='mb-4'>
          <LinkBtn btnText='Dashboard' url='/account' />
        </div>
      </article>
    </section>
  );
};

export default ErrorDeck;
