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
import { Recipe } from "../../api";
import { Link as RouterLink } from "react-router-dom";
import { NavBarItem } from "../../layout/components/navBarItem";

export const RecipeTable = ({
  data,
  onClickDeleteRecipe,
  onClickUpdateRecipe,
}: {
  data: Recipe[];
  onClickDeleteRecipe?: (recipe: Recipe) => void;
  onClickUpdateRecipe?: (recipe: Recipe) => void;
}) => {
  return (
    <TableContainer overflowY={"scroll"}>
      <Table>
        <Thead>
          <Tr display="flex" justifyContent="space-between">
            <Th>Name</Th>
            <Th>Categories</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {data.map((recipe) => {
            return (
              <Tr display="flex" justifyContent="space-between">
                <Td>
                  <NavBarItem
                    route={`/recipe/${recipe.id}`}
                    text={recipe.name ? recipe.name : ""}
                    size={10}
                  />
                </Td>

                <Td alignSelf="end" justifySelf="end">
                  {recipe.categories?.map((category) => (
                    <Tag margin={1}>{category.name}</Tag>
                  ))}
                </Td>
                <Td>
                  {onClickDeleteRecipe ? (
                    <IconButton
                      aria-label={"delete recipe"}
                      icon={<DeleteIcon />}
                      onClick={() => onClickDeleteRecipe(recipe)}
                    />
                  ) : (
                    ""
                  )}
                  {onClickUpdateRecipe ? (
                    <IconButton
                      aria-label={"update recipe"}
                      icon={<EditIcon />}
                      onClick={() => onClickUpdateRecipe(recipe)}
                    />
                  ) : (
                    ""
                  )}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
