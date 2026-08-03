import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("post").title("Blog posts"),
      S.listItem()
        .title("Comments")
        .child(
          S.list()
            .title("Comments")
            .items([
              S.listItem()
                .title("Approved")
                .child(
                  S.documentList()
                    .title("Approved comments")
                    .filter('_type == "comment" && approved == true')
                    .defaultOrdering([
                      { field: "createdAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("Hidden / pending")
                .child(
                  S.documentList()
                    .title("Hidden comments")
                    .filter('_type == "comment" && approved != true')
                    .defaultOrdering([
                      { field: "createdAt", direction: "desc" },
                    ]),
                ),
              S.listItem()
                .title("All comments")
                .child(
                  S.documentTypeList("comment").defaultOrdering([
                    { field: "createdAt", direction: "desc" },
                  ]),
                ),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "post" && item.getId() !== "comment",
      ),
    ]);
