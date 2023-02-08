export interface SectionOneOfAnyOfProps {
    label: string;
    activeIndex: number;
    onUpdate: (activeIndex: number) => void;
    children: React.ReactNode;
}

export interface SectionOneOfAnyOfClassNameContract {
    sectionOneOfAnyOf?: string;
    sectionOneOfAnyOf_label?: string;
    sectionOneOfAnyOf_selectSpan?: string;
    sectionOneOfAnyOf_select?: string;
}
