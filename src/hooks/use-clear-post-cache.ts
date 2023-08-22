import { useLocation } from "react-router-dom";
import {hooks} from "@allaround/all-components";
import {useEffect } from "react";

import {AccountType, constants, removeVideoFromS3, routes} from "../utils";

const { useLocalStorage} = hooks;

type Props = {
  activeAccountId: AccountType["id"]
}

const useClearPostCache = ({activeAccountId}: Props) => {
  const [_, setCache] = useLocalStorage(constants.POST_CACHE_KEY)
  const location = useLocation();

  useEffect(() => {
    const rawCache = window.localStorage.getItem(constants.POST_CACHE_KEY)
    const cache = JSON.parse(rawCache || "{}")
    if (!cache) return

    const clearCache = async () => {
      // const service = cache?.service
      const videoS3Key = cache?.videoS3Key

      if (!Object.values(routes.create).includes(location.pathname)) {
        setCache(null)

        if (videoS3Key) {
          await removeVideoFromS3({
            Key: videoS3Key,
            accountId: activeAccountId
          });
        }
      }
    }

    clearCache()
  }, [location, activeAccountId]);
}

export default useClearPostCache;
