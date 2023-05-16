import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ShapeProps, getAreas } from "../lib/svg";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type UploadFormProps = {
  file: FileList;
  rect?: { height: number; width: number };
  trapeze?: { height: number; "width-top": number; "width-bottom": number };
  freeform?: { height: number; width: number };
};

type ResultProps = {
  totalArea: number;
  shapes: ShapeProps[];
};

const Home = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UploadFormProps>({
    defaultValues: {
      rect: { height: 35.5, width: 85.5 },
      trapeze: { height: 35.5, "width-top": 85.5, "width-bottom": 75 },
      freeform: { height: 35.5, width: 85.5 },
    },
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const [result, setResult] = useState<ResultProps>();

  const tabs = ["rect", "trapeze", "freeform"];
  const calcArea = (data) => ({
    rect: data.height * data.width,
    trapeze: data.height * ((data["width-top"] + data["width-bottom"]) / 2),
    freeform: data.height * data.width,
  });
  const calcViewboxArea = (data) => ({
    rect: data.height * data.width,
    trapeze: data.height * Math.max(data["width-top"], data["width-bottom"]),
    freeform: data.height * data.width,
  });
  const [tabIndex, setTabIndex] = useState(0);

  const [puffer, setPuffer] = useState(10);
  const [m2perBucket, setM2perBucket] = useState(60);

  const onSubmit = async (data: UploadFormProps) => {
    const areaType = tabs[tabIndex];
    const realMaxArea = calcViewboxArea(data[areaType])[areaType];
    const realArea = calcArea(data[areaType])[areaType];

    const parsed = getAreas(await data.file[0].text(), realMaxArea);

    if (areaType !== "freeform") {
      setResult({ totalArea: realArea, shapes: parsed });
    } else {
      const totalArea = parsed.reduce((prev, next) => prev + next.area, 0);

      setResult({ totalArea, shapes: parsed });
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <div className="flex flex-row gap-4 items-center">
          <Image
            src="/images/android-chrome-512x512.png"
            alt="biber-logo"
            width="48"
            height="48"
          />
          <Heading>Choreo Biber</Heading>
        </div>
        <FormControl isInvalid={!!errors.file}>
          <FormLabel>Datei</FormLabel>
          <Input
            type="file"
            accept="image/svg+xml"
            {...register("file", { required: "Es wird eine Datei benötigt." })}
          />
          <FormHelperText>Bitte wähle eine .SVG Datei aus.</FormHelperText>
        </FormControl>

        <Tabs index={tabIndex} onChange={setTabIndex}>
          <TabList>
            <Tab>Rechteck</Tab>
            <Tab>Trapez</Tab>
            <Tab>Freiform / Oval ...</Tab>
          </TabList>

          <TabPanels>
            <TabPanel className="flex flex-col gap-4">
              <FormControl>
                <FormLabel size="sm">Höhe</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("rect.height", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel size="sm">Breite</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("rect.width", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
            </TabPanel>
            <TabPanel className="flex flex-col gap-4">
              <FormControl>
                <FormLabel size="sm">Höhe</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("trapeze.height", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel size="sm">Breite oben</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("trapeze.width-top", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel size="sm">Breite unten</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("trapeze.width-bottom", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
            </TabPanel>
            <TabPanel className="flex flex-col gap-4">
              <FormControl>
                <FormLabel size="sm">Maximale Höhe</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("freeform.height", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel size="sm">Maximale Breite</FormLabel>
                <InputGroup size="sm">
                  <Input
                    step={0.01}
                    type="number"
                    size="sm"
                    {...register("freeform.width", { required: true })}
                  />
                  <InputRightElement>m</InputRightElement>
                </InputGroup>
              </FormControl>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Button type="submit">Los gehts.</Button>
      </form>
      {result && (
        <div
          ref={resultsRef}
          className="flex flex-col gap-4 m-4 p-4 rounded-lg bg-gray-100"
        >
          <Heading>🎉 Ergebnisse</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Bezeichnung</Th>
                  <Th>Farbe</Th>
                  <Th isNumeric>Fläche in m²</Th>
                  <Th isNumeric>mit Puffer in m² </Th>
                  <Th isNumeric>Eimer</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <b>Gesamt</b>
                  </Td>
                  <Td />
                  <Td isNumeric>{result.totalArea.toFixed(2)}</Td>
                  <Td>
                    <Slider
                      size="sm"
                      value={puffer}
                      onChange={(val) => setPuffer(val)}
                    >
                      <SliderMark
                        value={puffer}
                        textAlign="center"
                        bg="blue.500"
                        fontSize="xs"
                        color="white"
                        mt="-8"
                        ml="-5"
                        w="10"
                      >
                        {puffer}%
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Td>
                  <Td>
                    <Slider
                      size="sm"
                      value={m2perBucket}
                      min={1}
                      max={120}
                      onChange={(val) => setM2perBucket(val)}
                    >
                      <SliderMark
                        value={m2perBucket}
                        textAlign="center"
                        bg="blue.500"
                        fontSize="xs"
                        color="white"
                        mt="-8"
                        ml="-8"
                        w="16"
                      >
                        {m2perBucket}m²/Eimer
                      </SliderMark>
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </Td>
                </Tr>
                {result.shapes.map((shape, i) => (
                  <Tr>
                    <Td>Farbe {i + 1}</Td>
                    <Td className="flex flex-row gap-2 items-center">
                      <span
                        style={{ background: shape.color }}
                        className="w-5 h-5 rounded-lg"
                      />
                      {shape.color}
                    </Td>
                    <Td isNumeric>{shape.area.toFixed(2)}</Td>
                    <Td isNumeric>
                      {(shape.area * (1 + puffer / 100)).toFixed(2)}
                    </Td>
                    <Td isNumeric>
                      {Math.ceil(
                        (shape.area * (1 + puffer / 100)) / m2perBucket
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
};

export default Home;
