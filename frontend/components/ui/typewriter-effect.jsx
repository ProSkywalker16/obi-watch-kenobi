import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(" "),
    };
  });

  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block mr-1">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black`, word.className)}
                >
                  {char}
                </span>
                
              ))}
              <span className={cn(`dark:text-white text-black`, word.className)}>
              &nbsp;
            </span>
            </div>
            
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "100%", // Increased width to 100% for the container
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold" // Increased text sizes here
          style={{
            whiteSpace: "nowrap", // Prevents wrapping
            wordBreak: "normal", // Ensures no unwanted breaks
            maxWidth: "100%", // Ensure it doesn’t exceed available space
            minWidth: "300px", // Set a minimum width for the container (adjust as needed)
          }}
        >
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-6 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};