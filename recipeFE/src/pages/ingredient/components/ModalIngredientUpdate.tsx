import {
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  VStack,
} from "@chakra-ui/react";
import { PostIngredientRequest } from "../../../api";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  InputControl,
  SubmitButton,
  TextareaControl,
} from "formik-chakra-ui";
import { ChangeEvent, useState } from "react";

export const ModalIngredientUpdate = ({
  initialValues,
  onSubmit,
  onClose,
  isOpen,
}: {
  initialValues: (PostIngredientRequest & { id?: string }) | null;
  onSubmit?: (data: PostIngredientRequest) => void;
  onClose: () => void;
  isOpen: boolean;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Formik<PostIngredientRequest>
        initialValues={
          initialValues ?? { name: "", description: "", amount: 0, unit: "" }
        } //nullish coalescing to set default values if initial values is null
        //onSubmit function, parameters is the values and a set of helpersw functions from formik
        onSubmit={(e, formikHelpers) => {
          console.log("submit", e);
          onSubmit?.(e);
          formikHelpers.setSubmitting(false);
        }}
      >
        <ModalContent as={Form}>
          <ModalHeader>
            {initialValues ? "Update Ingredient" : "Create Ingredient"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <InputControl name={"name"} label={"Name"} />
              <TextareaControl name={"description"} label={"Description"} />
              {/* <FormLabel>Amount</FormLabel>
                <NumberInput name={"amount"} min={0} /> */}
              <InputControl
                name="amount"
                label="Amount"
                inputProps={{ type: "number", min: 0, step: 1 }}
              />
              {
                <FormControl id="unit" name="unit" label="Unit">
                  <Field as={Select} placeholder="Select unit">
                    <option value="grams">Grams</option>
                    <option value="mili-grams">mG</option>
                    <option value="liters">Liters</option>
                    <option value="mili-liters">mL</option>
                    <option value="holes">Hole</option>
                  </Field>
                </FormControl>
              }
            </VStack>
          </ModalBody>
          <ModalFooter>
            <SubmitButton>
              {initialValues ? "Update Ingredient" : "Create Ingredient"}
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Formik>
    </Modal>
  );
};
