import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function RoomVisualizerSidebar() {
  const { t } = useTranslation();
  
  return (
    <aside className="w-full">
      <div className="text-sm text-neutral-700 dark:text-neutral-200">
        <section>
          <h3 className="text-[16px] font-semibold text-foreground mb-2">
            {t('room_visualizer.decoration_visualizer')}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {t('room_visualizer.room_design')}
          </p>

          <motion.div
            className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-md border border-border bg-background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/room.webp"
              alt="Decoration Virtualizer Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-xl"
              priority
            />
            
          </motion.div>

          <Button
            className="w-full my-3 text-sm font-medium"
            variant="default"
            asChild
          >
            <Link href="/room-visualizer">{t('room_visualizer.start_decorating')}</Link>
          </Button>
        </section>
      </div>
    </aside>
  );
}