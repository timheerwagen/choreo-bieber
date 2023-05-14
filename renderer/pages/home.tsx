import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ShapeProps, getAreas, getViewBox, getViewBoxRatio } from "../lib/svg";
import { useEffect, useState } from "react";

type UploadFormProps = {
  file: FileList;
  width?: number;
  height?: number;
};

type ResultProps = {
  totalArea: number;
  shapes: ShapeProps[];
};

const Home = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UploadFormProps>({ defaultValues: { width: 86 } });

  const files = watch("file");
  const width = watch("width");
  const height = watch("height");

  const [ratio, setRatio] = useState(0);

  const [result, setResult] = useState<ResultProps>();

  useEffect(() => {
    const calcRatio = async () => {
      if (!files?.[0]) return;
      const svgText = await files[0].text();

      const viewBoxRatio = getViewBoxRatio(getViewBox(svgText));

      setRatio(viewBoxRatio);
    };

    calcRatio();
  }, [files]);

  const [radioValue, setRadioValue] = useState<string>("width");

  const onSubmit = async (data: UploadFormProps) => {
    const realArea =
      radioValue === "height"
        ? height * (height * ratio)
        : width * (width / ratio);

    const parsed = getAreas(await data.file[0].text(), realArea);

    setResult({ totalArea: realArea, shapes: parsed });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
      >
        <Heading>Choreo Biber</Heading>
        <FormControl isInvalid={!!errors.file}>
          <FormLabel>Datei</FormLabel>
          <Input
            type="file"
            accept="image/svg+xml"
            {...register("file", { required: "Es wird eine Datei benötigt." })}
          />
          <FormHelperText>Bitte wähle eine .SVG Datei aus.</FormHelperText>
        </FormControl>
        <FormControl>
          <RadioGroup
            className="flex flex-row gap-4"
            onChange={setRadioValue}
            value={radioValue}
          >
            <FormControl>
              <FormLabel size="sm">Höhe</FormLabel>
              <Radio value="height" />
            </FormControl>
            <FormControl>
              <FormLabel size="sm">Breite</FormLabel>
              <Radio value="width" />
            </FormControl>
          </RadioGroup>
          <FormHelperText>Lege fest welche Seite fix sein soll.</FormHelperText>
        </FormControl>

        {radioValue === "height" ? (
          <FormControl>
            <FormLabel size="sm">Höhe</FormLabel>
            <InputGroup size="sm">
              <Input
                step={0.01}
                type="number"
                size="sm"
                {...register("height")}
              />
              <InputRightElement>m²</InputRightElement>
            </InputGroup>
          </FormControl>
        ) : (
          <FormControl>
            <FormLabel size="sm">Breite</FormLabel>
            <InputGroup size="sm">
              <Input
                step={0.01}
                type="number"
                size="sm"
                {...register("width")}
              />
              <InputRightElement>m²</InputRightElement>
            </InputGroup>
          </FormControl>
        )}
        {ratio ? (
          radioValue === "height" ? (
            <Text>
              Generierte <b>Breite</b>: {(height * ratio).toFixed(2)}
            </Text>
          ) : (
            <Text>
              Generierte <b>Höhe</b>: {(width / ratio).toFixed(2)}
            </Text>
          )
        ) : null}
        <Button type="submit">Los gehts.</Button>
      </form>
      {result && (
        <div className="flex flex-col gap-4 m-4 p-4 rounded-lg bg-gray-100">
          <Heading>Ergebnisse</Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Bezeichnung</Th>
                  <Th>Farbe</Th>
                  <Th isNumeric>Fläche in m²</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <b>Gesamt</b>
                  </Td>
                  <Td />
                  <Td isNumeric>{result.totalArea.toFixed(2)}</Td>
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
