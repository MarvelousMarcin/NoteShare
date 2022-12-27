import lock from "../../assets/lock.png";
import share from "../../assets/share.png";

const Note = ({ title, onClick, id }) => {
  return (
    <section
      onClick={onClick}
      className="flex cursor-pointer flex-row justify-between px-10 border-[#d9d3cd] border-2 rounded py-8 mb-5"
      id={id}
    >
      <div id={id} className="text-3xl">
        {title}
      </div>
      <div id={id} className="flex flex-row">
        <img id={id} className="" src={share} />
        <img id={id} className="" src={lock} />
      </div>
    </section>
  );
};

export default Note;
