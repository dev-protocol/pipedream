import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import { Tweet } from "../../common/types/responseSchemas";
import { getTweetFields } from "../../common/methods";
import { GetUserTweetsParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-user-tweets/list-user-tweets";
import cacheUserId from "../common/cacheUserId";

export default defineSource({
  ...common,
  key: "twitter-new-tweet-posted-by-user",
  name: "New Tweet Posted by User",
  description: `Emit new event when the specified User posts a Tweet [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
    ...tweetFieldProps,
  },
  methods: {
    ...common.methods,
    ...cacheUserId,
    getTweetFields,
    getItemSummary,
    getEntityName() {
      return "Tweet";
    },
    async getResources(customize: boolean): Promise<Tweet[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserTweetsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId,
      };

      if (customize) {
        params.params = this.getTweetFields();
      }

      const { data } = await this.app.getUserTweets(params);
      return data;
    },
  },
});
