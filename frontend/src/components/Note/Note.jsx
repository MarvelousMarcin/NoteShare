import lock from "../../assets/lock.png";
import share from "../../assets/share.png";

const Note = ({
  title,
  onClick,
  id,
  onShareClick,
  isPublic = false,
  user = "",
}) => {
  return (
    <section
      className="flex cursor-pointer flex-row justify-between px-10 border-[#d9d3cd] border-2 rounded py-8 mb-5"
      id={id}
    >
      <div onClick={onClick} id={id} className="text-3xl">
        {title}
      </div>
      <div id={id} className="flex flex-row items-center">
        {!isPublic && (
          <>
            <img
              alt="picture"
              onClick={onShareClick}
              id={id}
              className=""
              src={share}
            />
            <img alt="picture" id={id} className="" src={lock} />
          </>
        )}
        <p>{user}</p>
      </div>
    </section>
  );
};

export default Note;
