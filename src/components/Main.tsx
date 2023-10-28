import React from 'react';

type MainType = {
    isOpen?: boolean
}


type TitleType = {
    children?: any
}

const Main = ({ isOpen = true }: MainType) => {
    return (
        <div style={{ display: isOpen ? "flex" : "none", justifyContent: "center", position: "absolute", width: '100%'}}>
            <div style={{ padding: "3rem 4rem" }}>
                <Title>Light Saber</Title>
                <SubTitle>This game is now the ultimate power in the universe! Play with VR</SubTitle>
                <SubTitle>- <a href="https://hhj.devent.kr/">@huh.hyeongjun</a></SubTitle>

            </div>

        </div>
    );
};

const Title = ({ children }: TitleType) => {
    return (
        <div style={{ textAlign: "center", color: "#ffffff", fontSize: "3rem", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: "700" }}>{children}</div>

    )
}

const SubTitle = ({ children }: TitleType) => {
    return (
        <div style={{ textAlign: "center", color: "#ffffff", fontSize: "1rem", fontFamily: "'Noto Sans KR', sans-serif", fontWeight: "500", marginTop: "1rem" }}>{children}</div>

    )
}


export default Main;