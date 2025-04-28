
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { useColor } from '@/context/ColorContext';
import Header from '@/components/Header';
import ImagePicker from '@/components/ImagePicker';
import ColorDetail from '@/components/ColorDetail';
import SavedColors from '@/components/SavedColors';
import AdPlaceholder from '@/components/AdPlaceholder';

const Index = () => {
  const { currentColor } = useColor();
  const { toast } = useToast();

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">रङ पत्ता लगाउनुहोस्</h2>
              <ImagePicker />
            </div>
            
            <AdPlaceholder type="banner" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 shadow-sm">
              {currentColor ? (
                <ColorDetail color={currentColor} />
              ) : (
                <div className="py-16 text-center">
                  <h3 className="text-lg font-medium mb-2">कुनै रङ छनौट गरिएको छैन</h3>
                  <p className="text-sm text-muted-foreground">
                    बायाँतर्फको तस्बिरमा क्लिक गरेर रङ छान्नुहोस्
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <SavedColors />
            </div>
          </motion.div>
        </div>
        
        <div className="mt-8">
          <AdPlaceholder type="banner" />
        </div>
      </main>
    </div>
  );
};

export default Index;
