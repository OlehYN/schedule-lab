import pandas as pd
import collections


def parse_rows(io, header=0):
    df = parse_df(io, header)
    return [row.to_dict for _, row in df.iterrows()]


def parse_df(io, header=0):
    df = pd.read_excel(io, header=None)
    df = with_header(df, header)
    return df


def with_header(df, header=0):
    header_n = 0
    if isinstance(header, collections.Iterable):
        header_names = set((h for h in header if isinstance(h, str)))
        header_n = next((irow[0] for irow in df.iterrows()
                         if header_names.issubset(irow[1].values)),
                        header_n)

        header_cols = {
            i: name if not isinstance(header, dict) else
            header[i] if i in header else header[name]
            for i, name in df.iloc[header_n].items()
            if any(h in header for h in (i, name))
        }
        df.rename(header_cols, axis=1, inplace=True)
        df = df[list(header_cols.values())]
    else:
        if isinstance(header, int):
            header_n = header
        df.columns = df.iloc[header_n]
    df = df[header_n + 1:]
    df.dropna(how='all', inplace=True)
    return df
