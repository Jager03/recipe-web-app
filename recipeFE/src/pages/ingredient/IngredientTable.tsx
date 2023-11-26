import {
  IconButton,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Ingredient } from "../../api";

export const IngredientTable = ({
  data,
  onClickDeleteIngredient,
  onClickUpdateIngredient,
}: {
  data: Ingredient[];
  onClickDeleteIngredient: (ingredient: Ingredient) => void;
  onClickUpdateIngredient: (ingredient: Ingredient) => void;
}) => {
  return (
    <TableContainer overflowY={"scroll"}>
      <Table>
        <Thead>
          <Tr display="flex" justifyContent="space-between" alignSelf="center">
            <Th w={"20%"} textAlign={"left"}>
              Name
            </Th>
            <Th w={"30%"} textAlign={"left"}>
              Description
            </Th>
            <Th w={"20%"} textAlign={"left"}>
              Amount
            </Th>
            <Th w={"20%"} textAlign={"left"}>
              Unit
            </Th>
            <Th w={"10%"} textAlign={"left"} />
          </Tr>
        </Thead>
        <Tbody>
          {data.map((ingredient) => {
            return (
              <Tr display="flex" justifyContent="space-between">
                <Td w={"20%"} textAlign={"left"}>
                  {ingredient.name}
                </Td>
                <Td w={"30%"} textAlign={"left"}>
                  {ingredient.description}
                </Td>
                <Td w={"20%"} textAlign={"left"}>
                  {ingredient.amount}
                </Td>
                <Td w={"20%"} textAlign={"left"}>
                  {ingredient.unit}
                </Td>
                <Td w={"10%"} textAlign={"right"}>
                  <IconButton
                    aria-label={"delete ingredient"}
                    icon={<DeleteIcon />}
                    onClick={() => onClickDeleteIngredient(ingredient)}
                  />{" "}
                  <IconButton
                    aria-label={"update ingredient"}
                    icon={<EditIcon />}
                    onClick={() => onClickUpdateIngredient(ingredient)}
                  />{" "}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
