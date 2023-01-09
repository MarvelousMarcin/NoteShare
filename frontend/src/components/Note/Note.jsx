import share from "../../assets/settings.png";
import { motion } from "framer-motion";

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
      className="flex cursor-pointer shadow-xl flex-row justify-between px-10 border-[#d9d3cd] border-2 rounded py-8 mb-5"
      id={id}
    >
      <div onClick={onClick} id={id} className="text-3xl">
        {title}
      </div>
      <div id={id} className="flex flex-row items-center">
        {!isPublic && (
          <>
            <motion.img
              alt="picture"
              onClick={onShareClick}
              id={id}
              src={share}
              className="w-[2rem]"
              whileHover={{ rotate: "80deg" }}
            />
          </>
        )}
        <p>{user}</p>
      </div>
    </section>
  );
};

export default Note;
