interface Props {
  title: string;
  document: string;
}

function ViewDox({ title, document }: Props) {
  return (
    <>
      <div className="w-full md:w-3/4 p-5 rounded-lg bg-white mx-auto my-5">
        <iframe
          title={title}
          src={document}
          width={"100%"}
          height={"500px"}
        ></iframe>
        <div className="text-center pb-3 mt-3">
          <a
            href={document}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
          >
            View Document
          </a>
        </div>
      </div>
    </>
  );
}

export default ViewDox;
