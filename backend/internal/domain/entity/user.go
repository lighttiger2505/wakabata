package entity

type User struct {
	ID       string
	Username string
	Email    string
}

type CreateUser struct {
	Username string
	Email    string
	Password string
}

type UpdateUser struct {
	ID       string
	Username string
	Email    string
	Password string
}
