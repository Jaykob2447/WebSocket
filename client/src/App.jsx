import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import {
  getMessagesThunk,
  newMessagePending,
} from "./store/slices/messagesSlice";
import styles from "./App.module.css";
import { ws } from "./api";

function App({ messages, isFetching, error, limit, get, fetching }) {
  const scrollTo = useRef(null);

  useEffect(() => {
    get(limit);
  }, [limit]);

  const addMessage = (values, formikBag) => {
    // create(values);
    ws.createMessage(values);
    fetching();
    formikBag.resetForm();
  };

  const deleteMessage = (values) => {
    ws.deleteMessage(values);
  };

  useEffect(() => {
    scrollTo?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <article
      style={{ display: "flex", flexDirection: "column", height: "100vh" }}
    >
      <section style={{ overflowY: "auto" }}>
        <ul>
          {messages.map((m) => (
            <li key={m._id} className={styles.messageItem}>
              <p>{m._id}</p>
              <p>{m.body}</p>
              <p>{m.createdAt}</p>
              <button
                className={styles.messageDelete}
                onClick={() => deleteMessage(m._id)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
        <div ref={scrollTo} style={{ height: "20px" }}>
          {error && <div style={{ color: "red" }}>ERROR!!!</div>}
          {isFetching && <div>Messages is loading. Please, wait...</div>}
        </div>
      </section>

      <section className={styles.formContainer} style={{ marginTop: "auto" }}>
        <Formik initialValues={{ body: "" }} onSubmit={addMessage}>
          <Form>
            <Field name="body"></Field>
            <button type="submit">Send</button>
          </Form>
        </Formik>
      </section>
    </article>
  );
}

const mapStateToProps = ({ chat }) => chat;

const mapDispatchToProps = (dispatch) => ({
  get: (limit) => dispatch(getMessagesThunk(limit)),
  fetching: () => dispatch(newMessagePending()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
