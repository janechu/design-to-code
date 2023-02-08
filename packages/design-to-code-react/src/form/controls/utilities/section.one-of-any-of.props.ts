export interface SectionOneOfAnyOfProps {
    label: string;
    activeIndex: number;
    onUpdate: (activeIndex: number) => void;
    children: React.ReactNode;
}
