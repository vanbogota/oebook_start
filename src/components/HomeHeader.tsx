import LanguageSwitcher from "./LanguageSwitcher";

const HomeHeader: React.FC = () => {
  return (
    <header className="relative w-full border-b bg-card shadow-sm sticky top-0 z-50">
		<div className="absolute top-5 right-5">
			<LanguageSwitcher />
		</div>

    </header>
  );
};
export default HomeHeader;
