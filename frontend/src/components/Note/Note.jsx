import lock from "../../assets/lock.png";
import share from "../../assets/share.png";

const Note = ({ title }) => {
  return (
    <section className="flex flex-row justify-between px-10 border-[#d9d3cd] border-2 rounded py-8 mb-5">
      <div className="text-3xl">{title}</div>
      <div className="flex flex-row">
        <img className="" src={share} />
        <img className="" src={lock} />
      </div>
    </section>
  );
};

export default Note;
