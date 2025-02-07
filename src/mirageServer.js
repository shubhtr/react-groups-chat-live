import { createServer, Model, belongsTo, hasMany } from "miragejs";

export function makeServer() {
  createServer({
    models: {
      group: Model.extend({
        users: hasMany("user"),
      }),
      user: Model.extend({
        groups: hasMany("group"),
      }),
    },

    seeds(server) {
      const user1 = server.create("user", { id: 1, name: "User1", groupIds: [] });

      server.create("group", { id: 1, name: "React Developers", userIds: [] });
      server.create("group", { id: 2, name: "JavaScript Enthusiasts", userIds: [] });
      server.create("group", { id: 3, name: "Node.js Community", userIds: [] });
    },

    routes() {
      this.namespace = "api";

      // Get all groups (return user IDs instead of full objects)
      this.get("/groups", (schema) => {
        return {
          groups: schema.groups.all().models.map((group) => ({
            id: group.id,
            name: group.name,
            userIds: group.userIds || [], // Return user IDs instead of full objects
          })),
        };
      });

      // Join a group (store user ID instead of object reference)
      this.post("/groups/:id/join", (schema, request) => {
        let group = schema.groups.find(request.params.id);
        let { userId } = JSON.parse(request.requestBody);
        let user = schema.users.find(userId);

        if (group && user) {
          // Avoid duplicates
          if (!group.userIds.includes(user.id)) {
            group.update({ userIds: [...group.userIds, user.id] });
          }

          if (!user.groupIds.includes(group.id)) {
            user.update({ groupIds: [...user.groupIds, group.id] });
          }
        }

        return { success: true };
      });
    },
  });
}
