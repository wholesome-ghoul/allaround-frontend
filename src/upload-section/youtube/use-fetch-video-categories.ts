import { useEffect } from "react";

import type { AccountType } from "../../utils";
import { postRequest } from "../../utils";
import { Category, Option } from "./types";

type UseFetchVideoCategories = {
  activeAccount: AccountType | null;
  setVideoCategories: (categories: Option[]) => void;
  videoCategories: Option[];
  isVideoCategoriesFetched: boolean;
  setCategory: (category: Option) => void;
};

const useFetchVideoCategories = ({
  activeAccount,
  setVideoCategories,
  videoCategories,
  isVideoCategoriesFetched,
  setCategory,
}: UseFetchVideoCategories) => {
  useEffect(() => {
    if (!isVideoCategoriesFetched) return;

    if (videoCategories.length > 0) return;

    const fetchVideoCategories = async () => {
      const url = `${process.env.SERVER}/api/service/google/youtube/video-categories`;
      const body: { [key: string]: any } = { accountId: activeAccount?.id };

      if (videoCategories.length === 0) {
        body.etag = null;
      }

      const response = await postRequest({
        url,
        body,
        credentials: "include",
      });

      if (response.status === 304) return;

      if (response.success) {
        const data = response.data.categories as Category[];
        const categories = data.map((category) => {
          return {
            value: category.id,
            label: category.snippet.title,
          };
        });

        setVideoCategories(categories);
        setCategory(categories[0]);
      } else {
        console.error(response.data.error);
      }
    };

    fetchVideoCategories();
  }, [videoCategories, isVideoCategoriesFetched, activeAccount]);
};

export default useFetchVideoCategories;
