import { Box } from "@mui/material";
import { Header } from "../ui/Header";
import { AddLink } from "../ui/AddLink";
import { SearchField } from "../ui/SearchField";
import { StickyTree } from "react-virtualized-sticky-tree";
import { groupBy, uniq, sortBy } from "lodash";
import { Link, useRouteMatch } from "react-router-dom";
import { useMemo } from "react";
import { useGetPatients } from "./api";

export function Patients() {
  const { patients } = useGetPatients();

  return (
    <Box height="100vh">
      <Header text="Patients" />
      <Box px={2} sx={{ height: "calc(100% - 56px)" }}>
        <SearchField placeholder="Rechercher un patient" />
        <Box p={1} />
        <SectionList
          data={patients}
          transformBy={(patient) => patient.firstname.substring(0, 1).toUpperCase()}
          getDisplayRow={(patient) => `${patient?.firstname} ${patient?.lastname}`}
        />
        <AddLink to="/create" />
      </Box>
    </Box>
  );
}

function SectionList<T extends { id: string }>({
  data,
  transformBy,
  getDisplayRow,
  ...props
}: {
  data?: T[];
  transformBy: (d: T) => string;
  getDisplayRow: (d: T) => string;
}) {
  const { url } = useRouteMatch();

  const tree = useMemo(() => {
    const levelRoot = {
      root: {
        children: [...(sortBy(uniq(data?.map(transformBy))) || [])],
        depth: 0,
      },
    };

    const level1 = Object.entries(groupBy(data, transformBy))
      .map(([key, value]) => ({
        name: key,
        children: (value as T[]).map((v: T) => v.id),
        depth: 1,
      }))
      ?.reduce((a, b) => ({ ...a, [b.name]: b }), {});

    const level2 = data?.reduce((a: T, b: T) => {
      return {
        ...a,
        [String(b.id)]: { ...b, name: getDisplayRow(b), depth: 2 },
      };
    }, {} as any);

    const _tree: any = {
      ...levelRoot,
      ...level1,
      ...level2,
    };

    return _tree;
  }, [data, transformBy, getDisplayRow]);

  const getChildren = (id: any) => {
    if (tree[id].children) {
      return tree[id].children.map((id: any) => ({
        id,
        height: 30,
        isSticky: true,
        zIndex: 30 - tree[id].depth,
      }));
    }
  };

  return (
    <StickyTree
      root={{ id: "root", height: 30 } as any}
      height={window.innerHeight - 170}
      getChildren={getChildren}
      rowRenderer={({ id, style, nodeInfo }: any) => {
        const node = tree[id];

        return (
          <div
            key={id}
            style={{
              ...style,
              //  backgroundColor: "#f3f3f3",
              marginLeft: nodeInfo.depth === 2 ? "20px" : 0,
              fontWeight: nodeInfo.depth === 1 ? 900 : 500,
            }}
          >
            <Link to={url + "/" + node.id}>{node.name}</Link>
          </div>
        );
      }}
      renderRoot={false}
      overscanRowCount={20}
      {...props}
    />
  );
}
