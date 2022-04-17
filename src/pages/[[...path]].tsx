import { gql } from "@apollo/client";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import {
  Typography,
  Grid,
  Box,
  Link as MaterialLink,
  Breadcrumbs,
} from "@material-ui/core";
import { Folder, Description } from "@material-ui/icons";
import { useRouter } from "next/router";
import Link from "next/link";

import { File, FileTypes } from "../models/file";
import client from "../services/apiClient";

const LIST_DIRECTORY_QUERY = gql`
  query ListDirectoryQuery($path: String!) {
    filesByFolder(input: { path: $path }) {
      id
      type
      filename
      absolutePath
    }
  }
`;

interface PageProps {
  files: File[];
  paths: string[];
}

const IconByType = {
  folder: Folder,
  file: Description,
};

const buildPathByIndex = (paths: string[], index: number) => {
  return paths.slice(1, index + 1).join("/");
};

const Home: NextPage<PageProps> = ({ files, paths }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>FS - RMPFS</title>
      </Head>

      <Breadcrumbs
        style={{ marginTop: 20, marginBottom: 20 }}
        aria-label="breadcrumb"
      >
        {paths?.map((path, idx) => {
          const isLast = idx === paths?.length - 1;

          if (isLast) {
            return (
              <Typography color="primary" key={path}>
                {path}
              </Typography>
            );
          }

          return (
            <Link
              href={path === "root" ? "/" : buildPathByIndex(paths, idx)}
              passHref
              key={path}
            >
              <MaterialLink>{path}</MaterialLink>
            </Link>
          );
        })}
      </Breadcrumbs>

      <Grid container spacing={8}>
        {files.map((file) => {
          const Icon = IconByType[file.type];

          const LinkWrapper = ({ file, children, style }: any) => {
            if (file.type === FileTypes.FILE) {
              return (
                <a
                  href={`https://www.google.com/search?q=${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", ...style }}
                >
                  {children}
                </a>
              );
            }

            return (
              <Box
                style={{ cursor: "pointer", ...style }}
                onClick={() => router.push(file.absolutePath)}
              >
                {children}
              </Box>
            );
          };

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={file.absolutePath}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LinkWrapper
                file={file}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Icon style={{ fontSize: "4rem" }} color="primary" />
                <Typography
                  align="center"
                  component="h2"
                  variant="h5"
                  color="textPrimary"
                >
                  {file.filename}
                </Typography>
              </LinkWrapper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx
) => {
  const absolutePath = ctx.resolvedUrl.split("?")[0];

  try {
    const { data } = await client.query({
      query: LIST_DIRECTORY_QUERY,
      variables: { path: absolutePath },
    });

    return {
      props: {
        files: data?.filesByFolder,
        paths:
          absolutePath === "/"
            ? ["root"]
            : ["root", ...absolutePath.split("/").filter((str) => !!str)],
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Home;
