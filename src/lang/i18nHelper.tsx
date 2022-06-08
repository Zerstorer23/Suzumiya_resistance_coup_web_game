import {Fragment} from "react";

export function insert(t: (k: string) => string, key: string, ...params: any[]) {
    let text = t(key) as string;
    params.forEach((value, index, array) => {
        text = text.replaceAll(`$${index}`, value);
    });
    return text;
}


export function formatInsert(t: (k: string) => string, key: string, ...params: any[]): JSX.Element {
    let text = insert(t, key, ...params);
//&#13;&#10
    if (!text.includes("$n")) {
        return strongInsert(text);
    }
    const nlTokens = text.split("$n");
    return (<Fragment>{
        nlTokens.map((value, index, array) => {
            return <Fragment key={index}>{strongInsert(value)}<br/></Fragment>;
        })
    }
    </Fragment>);
}

function strongInsert(text: string): JSX.Element {
    const strTk = text.split("$b");
    let inserted = true;
    return <Fragment>
        {
            strTk.map((value, index) => {
                inserted = !inserted;
                if (!inserted) return <Fragment key={index}>{value}</Fragment>;
                return <strong key={index}>{value}</strong>;
            })
        }
    </Fragment>;
}