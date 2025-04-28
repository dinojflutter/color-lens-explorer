
import { motion } from 'framer-motion';
import { EyeIcon } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 flex flex-col items-center justify-center text-center"
    >
      <div className="flex items-center gap-2 mb-2">
        <EyeIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-primary">Color</span> Picker
        </h1>
      </div>
      <p className="text-muted-foreground max-w-lg">
        Upload an image or use your camera to discover colors from any object.
        HEX and RGB codes will be automatically generated.
      </p>
    </motion.header>
  );
}
