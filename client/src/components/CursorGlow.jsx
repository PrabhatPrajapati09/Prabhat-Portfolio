import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const CursorGlow = () => {
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    const springX = useSpring(mouseX, {
        stiffness: 250,
        damping: 30
    });

    const springY = useSpring(mouseY, {
        stiffness: 250,
        damping: 30
    });

    useEffect(() => {
        const moveCursor = (e) => {
            mouseX.set(e.clientX - 150);
            mouseY.set(e.clientY - 150);
        };

        window.addEventListener("mousemove", moveCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
        };
    }, []);

    return (
        <motion.div
            style={{
                left: springX,
                top: springY
            }}
            className="
                fixed
                w-[300px]
                h-[300px]
                rounded-full
                pointer-events-none
                z-[50]
                blur-[120px]
                bg-cyan-700/20
            "
        />
    );
};

export default CursorGlow;