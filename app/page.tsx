'use client'
import { useRouter } from 'next/navigation';
import styles from "@/app/styles/main.module.scss";
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/drawing');
  };

  return (
    <div className={styles.world}>
      <div className={styles.main}>
        <div className={styles.title}>This is block</div>
        <button className={styles.go} onClick={handleButtonClick}>
          지금 시작하기
        </button>
      </div>
      <div className={styles.populer}>
        <div className={styles.picture}>
          <Image fill={true} src={`/image/world-screenshot (1).png`} alt={'일단소개'} />
        </div>
        <div className={styles.picture}>
        <Image fill={true} src={`/image/world-screenshot (2).png`} alt={'일단소개'} />
        </div>
        <div className={styles.picture}>
        <Image fill={true} src={`/image/world-screenshot (3).png`} alt={'일단소개'} />
        </div>
        <div className={styles.picture}>
        <Image fill={true} src={`/image/world-screenshot (4).png`} alt={'일단소개'} />
        </div>
        <div className={styles.picture}>
        <Image fill={true} src={`/image/world-screenshot (5).png`} alt={'일단소개'} />
        </div>
      </div>
    </div>
  );
}
