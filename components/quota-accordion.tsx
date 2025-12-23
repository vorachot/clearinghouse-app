"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";

const quotaList = [
  {
    title: "template1",
    resoueces: [
      {
        name: "node1",
        organization: "Org A",
        resource: "CPU: 4, GPU: 1, RAM: 16",
      },
      {
        name: "node2",
        organization: "Org B",
        resource: "CPU: 8, GPU: 2, RAM: 32",
      },
    ],
  },
  {
    title: "template2",
    resoueces: [
      {
        name: "node1",
        organization: "Org A",
        resource: "CPU: 4, GPU: 1, RAM: 16",
      },
      {
        name: "node2",
        organization: "Org B",
        resource: "CPU: 8, GPU: 2, RAM: 32",
      },
    ],
  },
];

const QuotaAccordion = () => {
  return (
    <Accordion variant="splitted">
      {quotaList.map((quota, index) => (
        <AccordionItem key={index} title={quota.title}>
          <ul>
            {quota.resoueces.map((resource, resIndex) => (
              <li key={resIndex}>
                {resource.name} - {resource.organization} - {resource.resource}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
export default QuotaAccordion;
