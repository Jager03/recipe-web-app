import axios from "axios";
import { Configuration, DefaultApi } from ".";
import React from "react";

export const useApiClient = () => {
  return React.useMemo(() => {
    const basePath = "/api";
    const axiosInstance = axios.create();
    const config = new Configuration({ basePath });
    return new DefaultApi(config, basePath, axiosInstance);
  }, []);
};

//npx @openapitools/openapi-generator-cli generate -i ./open-api-recipe.yaml -g typescript-axios -o ./src/api
