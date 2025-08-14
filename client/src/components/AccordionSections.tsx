/* ---------------------------------------------------------------------------
   Component: AccordionSections
   Purpose:
     - Displays a list of course sections in an accordion format.
     - Each section can be expanded to reveal its chapters.
   Props:
     - sections: AccordionSectionsProps[]
       - sectionId: unique identifier for the section
       - sectionTitle: title of the section
       - chapters: array of chapters within the section
         - chapterId: unique identifier for the chapter
         - title: title of the chapter
   Libraries/Dependencies:
     - Accordion UI components (Accordion, AccordionItem, AccordionTrigger, AccordionContent)
       for expand/collapse functionality.
     - FileText icon from lucide-react for chapter items.
   Behavior:
     - Accordion type is set to "multiple" allowing multiple sections to be open at the same time.
     - Maps through sections to create AccordionItems.
     - Clicking a section header toggles its content visibility.
     - Inside each section, displays chapters with an icon and title.
--------------------------------------------------------------------------- */

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

const AccordionSections = ({ sections }: AccordionSectionsProps) => {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section.sectionId}
          value={section.sectionTitle}
          className="accordion-section"
        >
          {/* Accordion Trigger - Displays section title */}
          <AccordionTrigger className="accordion-section__trigger">
            <h5 className="accordion-section__title">{section.sectionTitle}</h5>
          </AccordionTrigger>

          {/* Accordion Content - Displays list of chapters */}
          <AccordionContent className="accordion-section__content">
            <ul>
              {section.chapters.map((chapter) => (
                <li
                  key={chapter.chapterId}
                  className="accordion-section__chapter"
                >
                  <FileText className="mr-2 w-4 h-4" />
                  <span className="test-sm">{chapter.title}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionSections;
