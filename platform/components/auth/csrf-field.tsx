type CsrfFieldProps = {
  token: string;
};

export function CsrfField({ token }: CsrfFieldProps) {
  return <input type="hidden" name="csrfToken" value={token} readOnly />;
}
