import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useForm } from "react-hook-form";

type ConvertFormProps = {
  file: FileList;
};

const ConverterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConvertFormProps>();

  const toast = useToast();

  const onSubmit = async (data: ConvertFormProps) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-4 items-center">
        <Link href="/home">
          <Button
            size="sm"
            leftIcon={
              <Icon>
                <ArrowLeftIcon />
              </Icon>
            }
          >
            Rechner
          </Button>
        </Link>
        <Heading>Bild zu .SVG Konverter</Heading>
      </div>
      <Text fontSize="sm">
        Wenn du im Besitz von Adobe Illustrator bist, solltest du dies lieber
        dafür verwenden SVGs zu tracen!
      </Text>
      <FormControl isInvalid={!!errors.file}>
        <FormLabel>Datei</FormLabel>
        <Input
          type="file"
          accept="image/png, image/jpeg"
          {...register("file", { required: "Es wird eine Datei benötigt." })}
        />
        <FormHelperText>Bitte wähle eine .SVG Datei aus.</FormHelperText>
      </FormControl>
      <Button type="submit">Herunterladen</Button>
    </form>
  );
};
export default ConverterPage;
