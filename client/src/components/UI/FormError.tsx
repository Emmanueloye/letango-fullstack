const FormError = ({ error }: { error?: string }) => {
  return (
    <>
      <ul className='bg-amber-700 text-slate-50 p-1 m-2 text-[14px] list-disc rounded-md'>
        {error?.split(',')?.map((err) => (
          <li key={err} className='ml-4'>
            {err}
          </li>
        ))}
      </ul>
    </>
  );
};

export default FormError;
