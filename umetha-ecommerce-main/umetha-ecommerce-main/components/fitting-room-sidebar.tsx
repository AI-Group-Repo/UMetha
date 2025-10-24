import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export default function FittingRoomSidebar() {
  const { t } = useTranslation();
  
  return (
    <aside className="w-full px-2">
      <div className="text-sm text-neutral-700 dark:text-neutral-200">
        <section className="space-y-4">
          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t('virtual_fitting.virtual_fitting_room')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('virtual_fitting.try_on_clothes')}
            </p>
          </div>

          {/* Fitting Room Preview */}
          <motion.div
            className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg border border-border bg-background"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            <Image
              src="/fitting.webp"
              alt="3D Fitting Room Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-2xl"
              priority
            />
          </motion.div>

          {/* Enter Button */}
          <Button
            className="w-full py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
            variant="default"
            asChild
          >
            <Link href="/virtual-room">
              {t('virtual_fitting.enter_fitting_room')}
            </Link>
          </Button>
        </section>
      </div>
    </aside>
  );
}
