import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function FittingRoomSidebar() {
  const { t } = useTranslation();
  
  return (
    <aside className="w-full">
      <div className="text-sm text-neutral-700 dark:text-neutral-200">
        <section>
          <h3 className="text-[16px] font-semibold text-foreground mb-2">
            {t('virtual_fitting.virtual_fitting_room')}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {t('virtual_fitting.try_on_clothes')}
          </p>

          <motion.div
            className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-md border border-border bg-background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src="/fitting.webp"
              alt="3D Fitting Room Preview"
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
            <Link href="/virtual-room">{t('virtual_fitting.enter_fitting_room')}</Link>
          </Button>
        </section>
      </div>
    </aside>
  );
}