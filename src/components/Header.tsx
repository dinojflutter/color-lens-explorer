
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
          <span className="text-primary">रङ</span> पिकर
        </h1>
      </div>
      <p className="text-muted-foreground max-w-lg">
        तस्विर अपलोड गर्नुहोस् वा क्यामेरा प्रयोग गरेर कुनै पनि वस्तुको रङ पत्ता लगाउनुहोस्। 
        हेक्स र आरजीबी कोडहरू स्वचालित रूपमा उत्पन्न हुनेछन्।
      </p>
    </motion.header>
  );
}
