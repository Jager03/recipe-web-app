import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  VStack,
} from "@chakra-ui/react";
import { PutCategoryRequest } from "../../../api";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";

export const ModalCategoryUpdate = ({
  initialValues,
  onSubmit,
  onClose,
  isOpen,
}: {
  initialValues: (PutCategoryRequest & { id?: string }) | null;
  onSubmit?: (data: PutCategoryRequest) => void;
  onClose: () => void;
  isOpen: boolean;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik<PutCategoryRequest>
        initialValues={initialValues ?? { name: "" }} //nullish coalescing to set default values if initial values is null
        //onSubmit function, parameters is the values and a set of helpersw functions from formik
        onSubmit={(e, formikHelpers) => {
          console.log("submit");
          onSubmit?.(e);
          formikHelpers.setSubmitting(false);
        }}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues ? "Update Category" : "Create Category"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <InputControl name={"name"} label={"Name"} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <SubmitButton>
              {initialValues ? "Update category" : "Create category"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik>
    </Modal>
  );
};
