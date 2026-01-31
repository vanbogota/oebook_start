"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { TabContext, TabType } from "@/contexts/MainTabContext";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { LinkIcon } from "lucide-react";
import { Button } from "@/components/common/button";

const ScanBookPage = () => {
  const t = useTranslations("ScanBook");
  const { changeTab } = useContext(TabContext);
  const linkArr = [
    {
      name: "Download for iOS",
      url: "https://apps.apple.com/us/app/doc-scan-pdf-scanner/id453312964",
    },
    {
      name: "Download for Android",
      url: "https://play.google.com/store/apps/details?id=at.ac.tuwien.caa.docscan&hl=en",
    },
  ];
  const scanInstructions = [
    "Open the DocScan app on your phone.",
    "Take clear photos of the book pages you want to scan.",
    "Crop and adjust the pages if needed.",
    "Export the scan as a PDF or image file.",
    "Return to this page to upload your scanned book.",
  ];

  const uploadScan = () => {
    console.log("upload scan clicked");
  };

  return (
    <Card className="mb-12 shadow-lg">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col gap-4 max-[450px]:flex-col max-[450px]:gap-2">
          <div className="mb-6">
            Use the DocScan app to scan book pages and upload them here.
          </div>
          <ol className="list-decimal list-inside space-y-6">
            <li>
              <span className="font-bold mb-4">Download the DocScan App</span>
              <ul className="list-inside my-2 space-y-2">
                {linkArr.map((link) => (
                  <li className="ml-4" key={link.name}>
                    <LinkIcon className="inline-block w-4 h-4 mr-1" />
                    <Link className="text-blue-600" href={link.url}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <span className="font-bold">How to Scan a Book</span>
              <div className="ml-4 my-2">
                <span>Instruction: </span>
                <a className="text-blue-600" href="https://help.transkribus.org/docscan" target="_blank">
                  here
                </a>
              </div>
              <ol className="list-decimal list-inside my-2 space-y-2">
                {scanInstructions.map((step, index) => (
                  <li className="ml-4" key={index}>
                    {step}
                  </li>
                ))}
              </ol>
            </li>
            <li>
              <span className="font-bold">Upload Your Scan</span>
              <div className="my-4 ml-4 ">
                When your scan is ready, upload it here:
              </div>
              <div className="ml-4 flex max-[450px]:justify-center">
                <Button
                  size="lg"
                  className="text-md md:px-12 py-6 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => uploadScan()}
                >
                  Upload scan
                </Button>
              </div>
            </li>
          </ol>
          <div></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanBookPage;
