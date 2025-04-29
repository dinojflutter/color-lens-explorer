
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertCircle } from 'lucide-react';
import { useColor } from '@/context/ColorContext';
import ColorSwatch from './ColorSwatch';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SavedColors() {
  const { savedColors, deleteColor, clearSavedColors, setCurrentColor } = useColor();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (savedColors.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <AlertCircle className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No Colors</h3>
        <p className="text-sm text-muted-foreground mt-2">
          You haven't saved any colors yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Saved Colors</h2>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all colors?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your saved colors.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                clearSavedColors();
                setIsDialogOpen(false);
              }}>
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="max-h-[300px]">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 p-1">
          <AnimatePresence initial={false}>
            {savedColors.map((color) => (
              <motion.div
                key={color.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <ColorSwatch
                  color={color}
                  onClick={() => setCurrentColor(color)}
                  size="md"
                  showCopyButton={false}
                />
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm"
                  onClick={() => deleteColor(color.id)}
                  aria-label="Delete color"
                >
                  <Trash2 className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
