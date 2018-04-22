import pandas as pd
import collections


def parse_rows(io, header=0):
    df = parse_io(io, header)
    return [row.to_dict for _, row in df.iterrows()]


def parse_io(io, header=0):
    xls = pd.ExcelFile(io)
    return parse_xls(xls, header)


def parse_xls(xls, header=0):
    df = xls.parse(header=None)
    return with_header(df, header)


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
    df = df.dropna(how='all')
    return df


def find_row_by_prefix(df, prefix):
    for irow in df.iterrows():
        val = str(irow[1].values[0])
        if val.startswith(prefix):
            return irow[0]


def fetch_fst_val(df, row):
    return df.loc[row][0]

