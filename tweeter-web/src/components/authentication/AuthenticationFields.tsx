interface Props {
  isBottomField: boolean;
  onChangeAlias: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onChange={props.onChangeAlias}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className={`form-floating ${props.isBottomField ? "mb-3" : ""}`}>
        <input
          type="password"
          className={`form-control ${props.isBottomField ? "bottom" : ""}`}
          id="passwordInput"
          placeholder="Password"
          onChange={props.onChangePassword}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;
