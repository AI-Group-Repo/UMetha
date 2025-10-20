import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
interface PageHeaderProps {
  title: string;
  description: string;
  backgroundImage: string;
}
const { t } = useTranslation();
export default function PageHeader({
  title,
  description,
  backgroundImage,
}: PageHeaderProps) {
  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden">
      <Image
        src={backgroundImage}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-3xl px-4"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
            {t(title)}
          </h1>
          <p className="text-lg md:text-xl text-white/80">{t(description)}</p>
        </motion.div>
      </div>
    </div>
  );
}
