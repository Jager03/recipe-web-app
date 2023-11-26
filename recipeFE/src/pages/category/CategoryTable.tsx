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
import { Category } from "../../api";

export const CategoryTable = ({
  data,
  onClickDeleteCategory,
  onClickUpdateCategory,
}: {
  data: Category[];
  onClickDeleteCategory: (category: Category) => void;
  onClickUpdateCategory: (category: Category) => void;
}) => {
  return (
    <TableContainer overflowY={"scroll"}>
      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((category) => {
            return (
              <Tr display="flex" justifyContent="space-between">
                <Td>{category.name}</Td>
                <Td alignSelf="end" justifySelf="end">
                  <IconButton
                    aria-label={"delete category"}
                    icon={<DeleteIcon />}
                    onClick={() => onClickDeleteCategory(category)}
                  />{" "}
                  <IconButton
                    aria-label={"update category"}
                    icon={<EditIcon />}
                    onClick={() => onClickUpdateCategory(category)}
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
