import Image from "next/image";
import styles from "./styles.module.scss";

interface NavbarProps {
  nameUser?: string;
}

const Navbar: React.FC<NavbarProps> = ({ nameUser = "Marcus" }) => {
  return (
    <header className={styles.header}>
      <Image
        src="/images/logo_focalpoint.png"
        alt="Logo Focal Point"
        width={150}
        height={36}
      />
      <h1>{`Bem-vindo de volta, ${nameUser}`}</h1>
      <span>Segunda, 01 de dezembro de 2025</span>
    </header>
  );
};

export default Navbar;
