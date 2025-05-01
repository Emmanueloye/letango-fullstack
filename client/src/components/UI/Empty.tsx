const Empty = ({ message }: { message: string }) => {
  return (
    <section>
      <article className='bg-gray-100 dark:bg-slate-800  dark:text-slate-50 p-3 shadow h-52 mt-2 flex flex-col justify-center items-center'>
        {message}
      </article>
    </section>
  );
};

export default Empty;
